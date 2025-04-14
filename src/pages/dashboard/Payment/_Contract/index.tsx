import {
  ClapEmoji,
  CrownEmoji,
  NiceGuySmileEmoji,
  PartyConfettiEmoji,
  PartyEmoji,
  TearsWithSmileEmoji,
  ThumbsUpEmoji,
  ThunderEmoji,
  WinkEmoji,
} from '@/assets/emojis';
import { ChatStarIcon } from '@/assets/icon';
import DashedList from '@/components/DashedList';
import PaymentSkeleton from '@/components/Skeletons/PaymentSkeleton';
import AnimatedMessage from '@/components/TypingAnimation/AnimatedMessage';
import { useGetContractInfoMutation } from '@/services/dashboard';
import { ICurrentContractData } from '@/services/dashboard/type';
import { RootState } from '@/store/store';
import { converToFloatingFormat } from '@/utils/numberFunc';
import {
  getLocalStorage,
  localStorageNames,
  setLocalStorage,
} from '@/utils/storageFunc';
import {
  Button,
  Card,
  Divider,
  Empty,
  Flex,
  Image,
  Tag,
  Typography,
} from 'antd';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { useEffect } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CreditInfoCard } from './CreditInfoCard';
import EduLoan from './EduLoan';

interface ICurrentYearContract extends ICurrentContractData {
  source: 'localStorage' | 'api';
  updated_at: number;
}

const ContractPayment = () => {
  const profile = useSelector((store: RootState) => store.authSlice?.profile);
  const { t } = useTranslation();
  const [getContractInfo, { data, isLoading }] = useGetContractInfoMutation();
  const emojis = [
    ThumbsUpEmoji,
    CrownEmoji,
    PartyConfettiEmoji,
    PartyEmoji,
    ClapEmoji,
    ThunderEmoji,
    WinkEmoji,
    NiceGuySmileEmoji,
  ];

  useEffect(() => {
    getContractInfo();
  }, [getContractInfo]);

  if (isLoading) return <PaymentSkeleton />;

  const currentYearContract: ICurrentYearContract =
    (data &&
      data?.data && {
        ...data?.data,
        source: 'api',
        updated_at: moment().unix(),
      }) ||
    getLocalStorage(localStorageNames.contract);

  // no contract found or no data responded for 10 minutes
  if (
    !currentYearContract ||
    Math.abs(
      moment.unix(currentYearContract?.updated_at).diff(moment(), 'minutes')
    ) >= 10
  ) {
    return (
      <Card style={{ maxWidth: 800 }}>
        {profile?.data?.paymentForm?.code === '11' ? (
          // Grant message
          <Flex
            vertical
            gap={10}
            style={{ alignItems: 'center', textAlign: 'center' }}
          >
            <AnimatedMessage>
              <span>
                <img
                  className="emoji-img"
                  src={emojis[Math.floor(Math.random() * emojis.length)]}
                />
              </span>
            </AnimatedMessage>
            <AnimatedMessage>
              <Typography.Title
                level={4}
                style={{ margin: 0, color: '#009500' }}
              >
                <span>{profile?.data?.paymentForm?.name}</span>
              </Typography.Title>
            </AnimatedMessage>
            <AnimatedMessage>
              <Typography.Paragraph>
                <span>
                  {`${profile?.data?.full_name}, ${t('dashboard.contract.grant_message')}`}
                </span>
              </Typography.Paragraph>
            </AnimatedMessage>
          </Flex>
        ) : (
          // No contract found message
          <Flex vertical gap={12} style={{ textAlign: 'center' }}>
            <Empty
              description={
                <Typography.Text
                  strong
                >{`${t('const.contract')} ${t('const.not_found')}`}</Typography.Text>
              }
              image={TearsWithSmileEmoji}
            />
            <Typography
              dangerouslySetInnerHTML={{
                __html: `${t('off_topic.tech_maintenance')}. ${t('off_topic.contract_links_info')}`,
              }}
            />
          </Flex>
        )}
      </Card>
    );
  }

  if (currentYearContract.source === 'api') {
    setLocalStorage(localStorageNames.contract, {
      ...currentYearContract,
      source: 'localStorage',
    } as ICurrentYearContract);
  }

  const diffAmount =
    currentYearContract?.debit +
    currentYearContract?.credit -
    currentYearContract?.eduContractSum;

  return (
    <Flex className="contract-section" wrap gap={20} align="center">
      <Flex className="payment__card" vertical gap={24}>
        <Flex className="chat-container" gap={12} wrap>
          <Image src={ChatStarIcon} alt="chat icon" preview={false} />
          <Flex vertical gap={79} className="payment__info-cards">
            <Card className="payment__overall-info-card">
              <AnimatedMessage>
                <Flex vertical gap={10} className="payment__contract-text">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        t('dashboard.contract.paid_information_text', {
                          fullname: profile?.data?.full_name,
                          year: profile?.data?.semester?.education_year?.name,
                          amount: converToFloatingFormat(
                            currentYearContract?.debit ?? 0
                          ),
                        })
                      ),
                    }}
                  />
                  {(diffAmount ?? 0) !== 0 ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          (diffAmount ?? 0) > 0
                            ? t('dashboard.contract.debt_information_text', {
                                amount: converToFloatingFormat(diffAmount ?? 0),
                              })
                            : t(
                                'dashboard.contract.overpaid_information_text',
                                {
                                  amount: converToFloatingFormat(
                                    -(diffAmount ?? 0)
                                  ),
                                }
                              )
                        ),
                      }}
                    />
                  ) : (
                    <Typography.Text>
                      {t('dashboard.contract.no_debts_text')}
                    </Typography.Text>
                  )}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        t('dashboard.contract.rest_amount_text', {
                          amount: converToFloatingFormat(
                            currentYearContract?.credit ?? 0
                          ),
                        })
                      ),
                    }}
                  />
                  <Typography.Text>
                    {`${t('const.last_update_time')}: ${moment.unix(currentYearContract?.updated_at).format('DD.MM.YYYY HH:mm')}`}
                  </Typography.Text>
                </Flex>
              </AnimatedMessage>
            </Card>

            {(diffAmount ?? 0) > 0 && (
              <Card className="payment__previous-debt-info-card">
                <Flex
                  wrap
                  justify="center"
                  style={{ columnGap: '50px', rowGap: '20px' }}
                >
                  <Typography.Text strong>
                    {t('dashboard.contract.debt_from_prev_year')}
                  </Typography.Text>
                  <Flex
                    vertical
                    className="debt-status status-check"
                    align="flex-end"
                    gap={4}
                  >
                    <Tag className="status-tag">
                      {converToFloatingFormat(diffAmount ?? 0)} {t('const.uzs')}
                    </Tag>
                    <Typography.Text strong className="status-text">
                      {t('dashboard.contract.not_paid')}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Card>
            )}

            <>
              <CreditInfoCard
                contractAmount={currentYearContract?.eduContractSum}
                paidAmount={currentYearContract?.debit}
              />
            </>
          </Flex>
        </Flex>

        <Divider />

        <Flex
          className="overall-payment-amount"
          justify="space-between"
          wrap
          gap={20}
        >
          <Typography.Text
            strong
            style={{ maxWidth: '169px', color: '#000000A6', fontSize: '16px' }}
          >
            {t('dashboard.contract.total_amount_unpaid')}:
          </Typography.Text>
          <Flex align="flex-end" gap={4}>
            <Typography.Title level={2} style={{ marginBottom: -3 }}>
              <CountUp
                end={currentYearContract?.credit}
                formattingFn={value => converToFloatingFormat(value)}
                style={{
                  color:
                    currentYearContract?.credit <= 0 ? '#52c41a' : '#eb2f96',
                }}
              />
            </Typography.Title>
            <Typography.Text style={{ color: '#00000073' }}>
              {t('const.uzs')}
            </Typography.Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        className="contracts-container"
        vertical
        gap={15}
        align="flex-start"
        style={{ width: '100%' }}
      >
        <EduLoan />
        <Card className="contract__card">
          <DashedList
            collapsable
            limit={8}
            className="drawer__dashed-list"
            list={[
              {
                label: t('const.contract'),
                value: (
                  <Button type="link" href={currentYearContract?.pdfLink}>
                    {t('const.download')}
                  </Button>
                ),
              },
              {
                label: t('dashboard.contract.contract_number'),
                value: currentYearContract?.contractNumber,
              },
              {
                label: t('dashboard.contract.contract_date'),
                value: currentYearContract?.contractDate,
              },
              {
                label: t('dashboard.contract.contract_type'),
                value: currentYearContract?.eduContractType,
              },
              {
                label: t('dashboard.contract.mfo_bank'),
                value: currentYearContract?.bankMfo,
              },
              {
                label: t('dashboard.contract.organization_account'),
                value: currentYearContract?.eduOrganizationAccount,
              },
              {
                label: t('dashboard.contract.organization_inn'),
                value: currentYearContract?.eduOrganizationInn,
              },
              {
                label: t('const.academic_year'),
                value: currentYearContract?.eduYear,
              },
              {
                label: t('dashboard.contract.contract_sum'),
                value: `${converToFloatingFormat(currentYearContract?.eduContractSum)} ${t('const.uzs')}`,
              },
              {
                label: t('dashboard.contract.paid_sum'),
                value: (
                  <span
                    style={{ color: '#52c41a' }}
                  >{`${converToFloatingFormat(currentYearContract?.debit)} ${t('const.uzs')}`}</span>
                ),
              },
              {
                label: t('dashboard.contract.total_debt'),
                value: (
                  <span
                    style={{ color: '#eb2f96' }}
                  >{`${converToFloatingFormat(currentYearContract?.credit)} ${t('const.uzs')}`}</span>
                ),
              },
              {
                label: t('dashboard.contract.education_organization'),
                value: currentYearContract?.eduOrganization,
              },
              {
                label: t('const.education_type'),
                value: currentYearContract?.eduType,
              },
              {
                label: t('const.education_form'),
                value: currentYearContract?.eduForm,
              },
              {
                label: t('const.course'),
                value: currentYearContract?.eduCourse,
              },
              {
                label: t('const.expertise'),
                value: currentYearContract?.eduSpeciality,
              },
              {
                label: t('const.fullname'),
                value: currentYearContract?.fullName,
              },
              {
                label: t('const.pinfl'),
                value: currentYearContract?.pinfl,
              },
            ]}
          />
        </Card>
      </Flex>
    </Flex>
  );
};

export default ContractPayment;
